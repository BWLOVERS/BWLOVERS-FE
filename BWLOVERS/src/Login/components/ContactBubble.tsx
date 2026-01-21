import GithubIcon from '@/assets/Login/icon_github.svg?react';
import MailIcon from '@/assets/Login/icon_mail.svg?react';

export default function ContactBubble() {
  return (
    <div className="relative flex h-19.5 w-47.5 flex-col justify-center gap-2 rounded-[0.75rem] bg-white px-4 drop-shadow-[0_0_4.5px_rgba(0,0,0,0.25)] filter">
      <div className="drop-r-shadow-[0_0_4.5px_rgba(0,0,0,0.25)] absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 -translate-y-full border-r-[0.75rem] border-b-[0.75rem] border-l-[0.75rem] border-r-transparent border-b-white border-l-transparent filter" />

      {/* 내용 */}
      <div className="flex items-center gap-2.5 text-caption-md text-black">
        <GithubIcon className="h-4.5 w-4.5 shrink-0 transition-colors" />
        <a
          href="http://github.com/BWLOVERS"
          target="_blank"
          rel="noopener noreferrer"
          className="transition"
        >
          BWLOVERS
        </a>
      </div>

      <div className="flex items-center gap-2.5 text-caption-md text-black">
        <MailIcon className="h-4.5 w-4.5 shrink-0" />
        <a href="mailto:bwlovers21@gmail.com" className="transition">
          bwlovers21@gmail.com
        </a>
      </div>
    </div>
  );
}
