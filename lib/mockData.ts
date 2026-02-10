import { parseISO } from "date-fns";

// Mock data for a single book to manage
export const mockManagedBook = {
  id: "managed-book-id-456",
  title: "Truyện Đang Quản Lý (Bản Dịch)",
  originalTitle: "Managed Story (Raw)",
  author: "Tác giả của tôi",
  originalAuthor: "My Author",
  coverImageUrl: "/placeholder.jpg",
  description:
    "Đây là mô tả chi tiết của truyện bạn đang quản lý. Bạn có thể thay đổi thông tin, cào chương mới hoặc dịch chương.",
  genres: [
    { id: "tag-1", name: "Phiêu Lưu" },
    { id: "tag-2", name: "Khoa Học" },
  ],
  status: "Đang tiến hành",
  views: 54321,
  createdAt: "2023-05-20T10:00:00Z",
  updatedAt: "2024-02-07T18:45:00Z",
  slug: "truyen-dang-quan-ly",
  source: "WebTruyen.com",
  sourceUrl: "https://webtruyen.com/managed-story-raw",
  chapters: Array.from({ length: 20 }, (_, i) => ({
    id: `chap-m${i + 1}`,
    chapterNumber: i + 1,
    title: `Chương ${i + 1}: Tựa đề chương ${i + 1}`,
    isTranslated: i % 3 !== 0, // Vài chương chưa dịch
    status: i % 4 === 0 ? "ERROR" : i % 3 === 0 ? "PENDING" : "DONE",
    lastUpdated: new Date(new Date("2024-02-07T18:45:00Z").getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
    contentRaw: `Đây là nội dung gốc của Chương ${i + 1}.`,
    contentTranslated:
      i % 3 !== 0
        ? `Đây là nội dung dịch của Chương ${i + 1}.`
        : `Nội dung của Chương ${i + 1} chưa được dịch.`,
  })),
};