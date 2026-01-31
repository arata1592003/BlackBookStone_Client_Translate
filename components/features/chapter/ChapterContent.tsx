interface Props {
  chapterNumber: number;
  title: string;
  wordCount: number;
  createdAt: string;
  content: string;
}

export const ChapterContent = ({
  chapterNumber,
  title,
  wordCount,
  createdAt,
  content,
}: Props) => {
  console.log(content)
  const paragraphs = content.split("\n");

  return (
    <article className="flex flex-col items-start gap-[5px] px-[50px] py-2.5 relative self-stretch w-full flex-[0_0_auto]">
      <header className="flex flex-col items-start gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <h1 className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-bold text-text-muted text-xl text-center tracking-[0.10px] leading-5 whitespace-nowrap">
          Chương {chapterNumber}: {title}
        </h1>

        <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-medium text-text-muted text-xl text-center tracking-[0.10px] leading-5 whitespace-nowrap">
            {wordCount} chữ
          </div>

          <time className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-medium text-text-muted text-xl text-center tracking-[0.10px] leading-5 whitespace-nowrap">
            {createdAt}
          </time>
        </div>
      </header>

      {paragraphs.map((paragraph, index) => (
        <div
          key={index}
          className="flex flex-col items-start gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]"
        >
          <p className="relative flex items-center justify-left self-stretch mt-[-1.00px] font-roboto font-normal text-text-muted text-xl tracking-[0.10px] leading-6">
            {paragraph}
          </p>
        </div>
      ))}
    </article>
  );
};
