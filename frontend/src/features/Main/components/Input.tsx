import { AtSign, CalendarX, Link2, Scissors } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { useExpiresAt, useMainActions } from "../Main.state";
import { useLinksActions } from "../Links.state";

export const Input = () => {
  const {
    setAlias,
    setUrl,
    setExpiresAt,
    cutUrl
  } = useMainActions();
  const { getAllLinks } = useLinksActions();
  const expiresAt = useExpiresAt();

  const cutLinkHandler = async (event) => {
    event.preventDefault();

    await cutUrl();
    await getAllLinks();

    event.target.reset();
  };

  return (
    <form onSubmit={cutLinkHandler}>
      <div className="flex gap-2 items-center">

        <label className="input input-lg w-80 ">
          <span className="label"><Link2 /></span>
          <input type="text" placeholder="Your looong url" onChange={e => setUrl(e.target.value)} />
        </label>

        <label className="input input-lg w-60 ">
          <span className="label"><AtSign /></span>
          <input type="text" placeholder="Alias" onChange={e => setAlias(e.target.value)} maxLength={20} />
        </label>

        <label className="input input-lg w-44 ">
          <span className="label"><CalendarX /></span>
          <button type="button" popoverTarget="rdp-popover" style={{ anchorName: "--rdp" } as React.CSSProperties}>
            {expiresAt ? expiresAt.toLocaleDateString() : <span className="opacity-50">{'Unlimited'}</span>}
          </button>
          <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
            <DayPicker className="react-day-picker" mode="single" selected={expiresAt} onSelect={setExpiresAt} />
          </div>
        </label>

        <button className="btn btn-primary ml-8" type="submit">
          <Scissors />
          <span className="uppercase">{'cut it'}</span>
        </button>

      </div>
    </form>
  );
}