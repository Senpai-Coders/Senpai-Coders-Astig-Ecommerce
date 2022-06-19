import React from "react";

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'

/* Redux */
import { useSelector ,useDispatch } from "react-redux";
import { closeNotifier } from "../../Features/uiSlice";

const Notifier = () => {

  const notifierState = useSelector((state)=> state.ui.notifier);
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(closeNotifier())
  }

  const accept = () =>{
    closeModal()
    notifierState.onAccept()
  }

  return (
    <>
      <Modal isOpen={notifierState.state} onClose={closeModal}>
        <ModalHeader className="dark:text-blue-200">{notifierState.title}</ModalHeader>
        <ModalBody>
          {notifierState.message}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button className="rounded-xl  " layout="outline" onClick={closeModal}>
              {notifierState.cancelBtnText}
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button className="rounded-xl  " onClick={accept}>{notifierState.acceptBtnText}</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button className="rounded-xl  " block size="large" layout="outline" onClick={closeModal}>
              {notifierState.cancelBtnText}
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={accept} className="rounded-xl  " block size="large">
              {notifierState.acceptBtnText}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Notifier;
