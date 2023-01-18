import { type FC } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface Props {
  message: string | undefined;
  openModal: string | undefined;
  setOpenModal: (openModal: string | undefined) => void;
  handleAction?: () => void;
}

const InfoModal: FC<Props> = ({
  message,
  openModal,
  setOpenModal,
  handleAction,
}) => {
  return (
    <>
      <Modal show={openModal === "open"} onClose={() => setOpenModal(undefined)}>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              {handleAction ? (
                <div className="flex justify-center gap-4">
                  <Button color="success" onClick={handleAction}>
                    OK, do it!
                  </Button>
                  <Button color="failure" onClick={() => setOpenModal(undefined)}>
                    NO, get me out of here!
                  </Button>
                </div>
              ) : (
                <Button color="failure" onClick={() => setOpenModal(undefined)}>
                  OK
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InfoModal;
