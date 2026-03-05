"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Loader2,
  Settings2,
  FileType,
  Hash,
  FolderTree,
  FileStack,
} from "lucide-react";
import { getBookDownloadDataAction } from "@/app/actions/download";
import JSZip from "jszip";
import { cn } from "@/lib/utils";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

interface DownloadBookDialogProps {
  bookId: string;
  bookTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DownloadBookDialog = ({
  bookId,
  bookTitle,
  isOpen,
  onOpenChange,
}: DownloadBookDialogProps) => {
  const [options, setOptions] = useState({
    raw: false,
    translate: true,
    summary: false,
  });
  const [format, setFormat] = useState("txt");
  const [saveMode, setSaveMode] = useState("split");
  const [namingPattern, setNamingPattern] = useState("chuong-{n}");
  const [customPattern, setCustomPattern] = useState("chuong-{n}");
  const [isCustom, setIsCustom] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activePattern = isCustom ? customPattern : namingPattern;

  const handleDownload = async () => {
    if (!options.raw && !options.translate && !options.summary) {
      alert("Vui lòng chọn ít nhất một nội dung để tải xuống.");
      return;
    }

    setIsDownloading(true);
    try {
      const result = await getBookDownloadDataAction(bookId);
      if (result.success && result.data) {
        await generateZip(result.data);
        onOpenChange(false);
      } else {
        alert(result.error || "Không thể lấy dữ liệu truyện.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Có lỗi xảy ra trong quá trình tải xuống.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatChapterName = (num: number, title?: string) => {
    const paddedNum = num.toString().padStart(5, "0");
    return activePattern
      .replace(/{n}/g, num.toString())
      .replace(/{n\.(\d+)}/g, (_, digits) =>
        num.toString().padStart(parseInt(digits), "0"),
      )
      .replace(/{nn}/g, paddedNum)
      .replace(/{t}/g, title || "");
  };

  const generateEpubBlob = async (chapters: any[]) => {
    const epub = new JSZip();

    epub.file("mimetype", "application/epub+zip", { compression: "STORE" });

    epub.file(
      "META-INF/container.xml",
      `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`,
    );

    epub.file(
      "OEBPS/stylesheet.css",
      `body { font-family: "Times New Roman", serif; padding: 5%; line-height: 1.6; }
h1 { text-align: center; color: #333; margin-bottom: 2em; }
p { text-indent: 1.5em; margin-bottom: 0.8em; text-align: justify; }`,
    );

    let manifest = "";
    let spine = "";
    let toc = "";

    chapters.forEach((ch, i) => {
      const fileName = `chapter_${ch.number}.html`;
      const title = `Chương ${ch.number}: ${ch.titleTranslated || ""}`;
      const content = ch.contentTranslated || "Nội dung trống";

      const html = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${title}</title><link rel="stylesheet" href="stylesheet.css" type="text/css"/></head>
<body><h1>${title}</h1>${content
        .split("\n")
        .filter((l: string) => l.trim())
        .map((line: string) => `<p>${line}</p>`)
        .join("")}</body></html>`;

      epub.file(`OEBPS/${fileName}`, html);
      manifest += `<item id="ch${ch.number}" href="${fileName}" media-type="application/xhtml+xml"/>\n`;
      spine += `<itemref idref="ch${ch.number}"/>\n`;
      toc += `<navPoint id="nav${ch.number}" playOrder="${i + 1}"><navLabel><text>${title}</text></navLabel><content src="${fileName}"/></navPoint>\n`;
    });

    epub.file(
      "OEBPS/content.opf",
      `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${bookTitle}</dc:title><dc:language>vi</dc:language>
    <dc:identifier id="pub-id">bsb-${bookId}</dc:identifier><dc:creator>BlackStoneBook</dc:creator>
  </metadata>
  <manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="style" href="stylesheet.css" media-type="text/css"/>${manifest}</manifest>
  <spine toc="ncx">${spine}</spine>
</package>`,
    );

    epub.file(
      "OEBPS/toc.ncx",
      `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="bsb-${bookId}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>
  <docTitle><text>${bookTitle}</text></docTitle><navMap>${toc}</navMap>
</ncx>`,
    );

    return await epub.generateAsync({ type: "blob" });
  };

  const generateDocxBlob = async (chapters: any[], bookTitle: string) => {
    const doc = new Document({
      sections: chapters.map((ch) => {
        const paragraphs = (ch.content || "")
          .split(/\n\s*\n/)
          .map(
            (p: string) =>
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                  line: 360,
                  after: 200,
                },
                children: [
                  new TextRun({
                    text: p.trim(),
                    font: "Times New Roman",
                    size: 28,
                  }),
                ],
              }),
          );

        return {
          children: [
            new Paragraph({
              text: `Chương ${ch.number}: ${ch.title || ""}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            ...paragraphs,
          ],
        };
      }),
    });

    return await Packer.toBlob(doc);
  };

  const generateJsonBlob = async (
    chapters: any[],
    options: { raw: boolean; translate: boolean; summary: boolean },
  ) => {
    const dataToExport = chapters.map((ch) => {
      const chapterData: any = {
        number: ch.number,
        titleRaw: ch.titleRaw,
        titleTranslated: ch.titleTranslated,
      };
      if (options.raw) chapterData.contentRaw = ch.contentRaw;
      if (options.translate)
        chapterData.contentTranslated = ch.contentTranslated;
      if (options.summary) chapterData.summaryTranslated = ch.summaryTranslated;
      return chapterData;
    });

    return new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
  };

  const generateZip = async (chapters: any[]) => {
    const zip = new JSZip();

    const translateFolder = options.translate ? zip.folder("translate") : null;
    const rawFolder = options.raw ? zip.folder("raw") : null;
    const summaryFolder = options.summary ? zip.folder("summary") : null;

    if (translateFolder && format === "epub") {
      const epubBlob = await generateEpubBlob(chapters);
      translateFolder.file(`${bookTitle.replace(/\s+/g, "_")}.epub`, epubBlob);
    }

    if (saveMode === "split") {
      for (const ch of chapters) {
        const fileNameBase = formatChapterName(
          ch.number,
          ch.titleTranslated || ch.titleRaw,
        );

        if (translateFolder && format !== "epub" && ch.contentTranslated) {
          if (format === "docx") {
            const docxBlob = await generateDocxBlob(
              [{ number: ch.number, title: ch.titleTranslated, content: ch.contentTranslated }],
              bookTitle,
            );
            translateFolder.file(`${fileNameBase}.docx`, docxBlob);
          } else if (format === "json") {
            const jsonBlob = await generateJsonBlob([ch], options);
            translateFolder.file(`${fileNameBase}.json`, jsonBlob);
          } else {
            const content = `Chương ${ch.number}: ${ch.titleTranslated || ""}\n\n${ch.contentTranslated}`;
            translateFolder.file(`${fileNameBase}.txt`, content);
          }
        }

        if (rawFolder && ch.contentRaw) {
          if (format === "docx") {
            const docxBlob = await generateDocxBlob(
              [{ number: ch.number, title: ch.titleRaw, content: ch.contentRaw }],
              bookTitle,
            );
            rawFolder.file(`${fileNameBase}.docx`, docxBlob);
          } else if (format === "json") {
            const jsonBlob = await generateJsonBlob([ch], { raw: true, translate: false, summary: false });
            rawFolder.file(`${fileNameBase}.json`, jsonBlob);
          } else {
            const content = `Chương ${ch.number}: ${ch.titleRaw || ""}\n\n${ch.contentRaw}`;
            rawFolder.file(`${fileNameBase}.txt`, content);
          }
        }

        if (summaryFolder && ch.summaryTranslated) {
          if (format === "docx") {
            const docxBlob = await generateDocxBlob(
              [{ number: ch.number, title: `Tóm tắt Chương ${ch.number}`, content: ch.summaryTranslated }],
              bookTitle,
            );
            summaryFolder.file(`${fileNameBase}.docx`, docxBlob);
          } else if (format === "json") {
            const jsonBlob = await generateJsonBlob([ch], { raw: false, translate: false, summary: true });
            summaryFolder.file(`${fileNameBase}.json`, jsonBlob);
          } else {
            const content = `Chương ${ch.number}\n\n${ch.summaryTranslated}`;
            summaryFolder.file(`${fileNameBase}.txt`, content);
          }
        }
      }
    } else {
      const fileName = `${bookTitle.replace(/\s+/g, "_")}`;

      if (translateFolder && format !== "epub") {
        if (format === "docx") {
          const docxChapters = chapters.map(ch => ({ number: ch.number, title: ch.titleTranslated, content: ch.contentTranslated }));
          const docxBlob = await generateDocxBlob(docxChapters, bookTitle);
          translateFolder.file(`${fileName}.docx`, docxBlob);
        } else if (format === "json") {
          const jsonBlob = await generateJsonBlob(chapters, options);
          translateFolder.file(`${fileName}.json`, jsonBlob);
        } else {
          const content = chapters
            .map(
              (ch) =>
                `Chương ${ch.number}: ${ch.titleTranslated || ""}\n\n${ch.contentTranslated || ""}`,
            )
            .join("\n\n" + "=".repeat(40) + "\n\n");
          translateFolder.file(`${fileName}.txt`, content);
        }
      }

      if (rawFolder) {
        if (format === "docx") {
          const docxChapters = chapters.map(ch => ({ number: ch.number, title: ch.titleRaw, content: ch.contentRaw }));
          const docxBlob = await generateDocxBlob(docxChapters, bookTitle);
          rawFolder.file(`${fileName}.docx`, docxBlob);
        } else if (format === "json") {
          const jsonBlob = await generateJsonBlob(chapters, { raw: true, translate: false, summary: false });
          rawFolder.file(`${fileName}.json`, jsonBlob);
        } else {
          const content = chapters
            .map(
              (ch) =>
                `Chương ${ch.number}: ${ch.titleRaw || ""}\n\n${ch.contentRaw || ""}`,
            )
            .join("\n\n" + "=".repeat(40) + "\n\n");
          rawFolder.file(`${fileName}.txt`, content);
        }
      }

      if (summaryFolder) {
        if (format === "docx") {
          const docxChapters = chapters.map(ch => ({ number: ch.number, title: `Tóm tắt Chương ${ch.number}`, content: ch.summaryTranslated }));
          const docxBlob = await generateDocxBlob(docxChapters, bookTitle);
          summaryFolder.file(`${fileName}.docx`, docxBlob);
        } else if (format === "json") {
          const jsonBlob = await generateJsonBlob(chapters, { raw: false, translate: false, summary: true });
          summaryFolder.file(`${fileName}.json`, jsonBlob);
        } else {
          const content = chapters
            .map((ch) => `Chương ${ch.number}\n\n${ch.summaryTranslated || ""}`)
            .join("\n\n" + "=".repeat(40) + "\n\n");
          summaryFolder.file(`${fileName}.txt`, content);
        }
      }
    }

    const zipContent = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipContent);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bookTitle.replace(/\s+/g, "_")}_BSB_Backup.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewName = useMemo(
    () => formatChapterName(1, "Khởi đầu mới"),
    [activePattern],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px] bg-surface-card border-white/10 text-white max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="text-primary-accent" size={20} />
            <DialogTitle className="text-xl">
              Cấu trúc tải xuống nâng cao
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Đóng gói truyện thành file <strong>.ZIP</strong> với các định dạng
            chuyên dụng.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary-accent uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-accent rounded-full"></span>1.
              Thành phần nội dung
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "translate", label: "Bản dịch", key: "translate" },
                { id: "raw", label: "Bản gốc", key: "raw" },
                { id: "summary", label: "Tóm tắt", key: "summary" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 bg-background/50 hover:bg-white/5 cursor-pointer transition-all"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof options],
                    }))
                  }
                >
                  <Checkbox
                    checked={options[item.key as keyof typeof options]}
                  />
                  <Label className="text-sm font-medium cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold text-primary-accent uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-accent rounded-full"></span>2.
              Chế độ lưu trữ
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all",
                  saveMode === "split"
                    ? "border-primary bg-primary/10"
                    : "border-white/5 bg-background/50 hover:bg-white/5",
                )}
                onClick={() => setSaveMode("split")}
              >
                <FolderTree
                  size={24}
                  className={
                    saveMode === "split" ? "text-primary" : "text-gray-500"
                  }
                />
                <span className="text-sm font-bold">Tách chương</span>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all",
                  saveMode === "merge"
                    ? "border-primary bg-primary/10"
                    : "border-white/5 bg-background/50 hover:bg-white/5",
                )}
                onClick={() => setSaveMode("merge")}
              >
                <FileStack
                  size={24}
                  className={
                    saveMode === "merge" ? "text-primary" : "text-gray-500"
                  }
                />
                <span className="text-sm font-bold">Gộp chương</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold text-primary-accent uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-accent rounded-full"></span>3.
              Định dạng & Đặt tên
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold">
                  <FileType size={12} /> Định dạng file
                </Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-background border-white/10 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-card border-white/10 text-white">
                    <SelectItem value="txt">Văn bản (.txt)</SelectItem>
                    <SelectItem value="docx">Microsoft Word (.docx)</SelectItem>
                    <SelectItem value="epub">Sách điện tử (.epub)</SelectItem>
                    <SelectItem value="json">Dữ liệu (.json)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold">
                  <Hash size={12} /> Kiểu tên file
                </Label>
                <Select
                  value={isCustom ? "custom" : namingPattern}
                  onValueChange={(val) => {
                    if (val === "custom") setIsCustom(true);
                    else {
                      setIsCustom(false);
                      setNamingPattern(val);
                    }
                  }}
                >
                  <SelectTrigger className="bg-background border-white/10 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-card border-white/10 text-white">
                    <SelectItem value="chuong-{n}">Chương 1</SelectItem>
                    <SelectItem value="chapter-{n.5}">Chapter 00001</SelectItem>
                    <SelectItem value="{n}. {t}">{"{n}"}. Tiêu đề</SelectItem>
                    <SelectItem value="custom">-- Tùy chỉnh... --</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isCustom && (
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-background/50 border border-primary/20">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold text-gray-300 uppercase">
                    Cấu trúc tùy chỉnh
                  </Label>
                  <div className="flex gap-2">
                    {[
                      { t: "{n}", d: "Số" },
                      { t: "{n.5}", d: "00001" },
                      { t: "{t}", d: "Tiêu đề" },
                    ].map((token) => (
                      <div
                        key={token.t}
                        className="flex flex-col items-center gap-1"
                      >
                        <button
                          onClick={() =>
                            setCustomPattern((prev) => prev + token.t)
                          }
                          className="text-[10px] bg-primary/20 hover:bg-primary/40 text-primary-accent px-2 py-0.5 rounded border border-primary/30 transition-colors"
                        >
                          {token.t}
                        </button>
                        <span className="text-[8px] text-gray-500 font-medium">
                          {token.d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Input
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  placeholder="Ví dụ: chuong-{n.5}"
                  className="bg-surface-card border-white/10 focus:border-primary-accent h-9"
                />
              </div>
            )}
            <div className="mt-2 p-3 rounded-md bg-primary/5 border border-primary/10">
              <p className="text-[9px] uppercase text-primary-accent font-bold mb-1 opacity-70">
                Xem trước tên file:
              </p>
              <p className="text-sm font-mono text-white truncate">
                {previewName}.{format === "epub" ? "epub" : format}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 mt-4 border-t border-white/5 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 hover:bg-white/5 text-gray-400"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-[2] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Tải file .ZIP
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
