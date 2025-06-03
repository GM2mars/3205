import React from "react";

import { useLinkInfo, useLinksActions } from "../Links.state";

export const InfoModal = () => {
  const modalInfoRef = React.useRef<HTMLDialogElement>(null);
  const { setInfo } = useLinksActions();
  const info = useLinkInfo();

  const closeModal = () => {
    setInfo(null);
  };

  React.useEffect(() => {
    info && modalInfoRef.current?.showModal();
  }, [info]);

  return (
    <dialog id="info-link" className="modal" ref={modalInfoRef} >
      <div className="modal-box" >
        <h3 className="font-bold text-lg">Info</h3>
        <pre className="py-4">{JSON.stringify(info, null, 2)}</pre>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={closeModal}>
        <button>close</button>
      </form>
    </dialog>
  );
};