import React from "react";

import { useLinksActions, useLinkStat } from "../Links.state";

export const StatModal = () => {
  const modalStatRef = React.useRef<HTMLDialogElement>(null);
  const { setStat } = useLinksActions();
  const stat = useLinkStat();

  const closeModal = () => {
    setStat(null);
  };

  React.useEffect(() => {
    stat && modalStatRef.current?.showModal();
  }, [stat]);

  return (
    <dialog id="stat-link" className="modal" ref={modalStatRef} >
      <div className="modal-box" >
        <h3 className="font-bold text-lg">Info</h3>
        <pre className="py-4">{JSON.stringify(stat, null, 2)}</pre>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={closeModal}>
        <button>close</button>
      </form>
    </dialog>
  );
};