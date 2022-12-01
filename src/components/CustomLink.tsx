import Link from "next/link";
import { type FC } from "react";

type Props = {
  label: string | null | undefined;
  href: string;
  onClick?: () => void;
};
const CustomLink: FC<Props> = ({ label, href }: Props) => {
  return (
    <Link href={href}>
      <div className="group h-[40px] overflow-hidden p-2">
        <div className=" flex flex-col items-center justify-center transition duration-700 group-hover:-translate-y-10">
          <span className="text-xl">{label}</span>
          <span className="text-xl">{label}</span>
        </div>
      </div>
    </Link>
  );
};

export default CustomLink;
