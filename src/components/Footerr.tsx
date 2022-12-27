import { type FC } from "react";
import { Footer } from "flowbite-react";

const Footerr: FC = () => {
  return (
    <Footer
      className="align-center flex justify-center bg-gradient-to-r from-[#d0d2f5] to-[#857995] opacity-90"
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
