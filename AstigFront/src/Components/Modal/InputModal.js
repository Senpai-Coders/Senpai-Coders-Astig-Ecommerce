import React from "react";

import { Modal, ModalBody } from '@windmill/react-ui'

/* Redux */
import { useSelector ,useDispatch } from "react-redux";
import { closeInputModal } from "../../Features/uiSlice";

const InputModal = () => {
const inputModalState = useSelector((state)=> state.ui.inputModal);
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(closeInputModal())
  }

  // const accept = () =>{
  //   closeModal()
  //   inputModalState.onAccept()
  // }

  return (
    <>
      <Modal isOpen={inputModalState.state} onClose={closeModal}>
        {/* <ModalHeader>{inputModalState.title}</ModalHeader> */}
        <ModalBody>
          {inputModalState.component}
        </ModalBody>
        {/* <ModalFooter>
          <div className="hidden sm:block">
            <Button className="rounded-xl  " layout="outline" onClick={closeModal}>
              {inputModalState.cancelBtnText}
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button className="rounded-xl  " onClick={accept}>{inputModalState.acceptBtnText}</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button className="rounded-xl  " block size="large" layout="outline" onClick={closeModal}>
              {inputModalState.cancelBtnText}
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={accept} className="rounded-xl  " block size="large">
              {inputModalState.cancelBtnText}
            </Button>
          </div>
        </ModalFooter> */}
      </Modal>
    </>
  );
};

export default InputModal;
