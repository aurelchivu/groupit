import { type FC } from "react";
import { Footer } from "flowbite-react";

const Footerr: FC = () => {
  return (
    <Footer
      className="align-center flex justify-center bg-[#417177] opacity-90 dark:bg-gray-800"
      container={true}
    >
      <Footer.Copyright
        className="text-black"
        href="/"
        by="Group IT™"
        year={2023}
      />
    </Footer>
  );
};

export default Footerr;
