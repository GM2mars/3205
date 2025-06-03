import React from "react";
import { ChartNoAxesCombined, Info, Trash2 } from "lucide-react";

import { useLinks, useLinksActions } from "../Links.state";
import { InfoModal } from "./InfoModal";
import { StatModal } from "./StatModal";

const API_URL = import.meta.env.VITE_API_URL;

export const List = () => {
  const {
    getAllLinks,
    getInfo,
    getStat,
    deleteLink,
  } = useLinksActions();
  const links = useLinks();

  const showInfoHandler = (alias: string) => {
    getInfo(alias);
  };

  const showStatHandler = (alias: string) => {
    getStat(alias);
  };

  React.useEffect(() => {
    getAllLinks();
  }, []);

  return (
    <>
      <ul className="flex flex-col gap-2 w-full">
        {links.map(link => (
          <li key={link.id} className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-md transition-colors">
            <a href={`${API_URL}/${link.alias}`} target="_blank" className="flex-1 text-3xl">{link.alias}</a>
            <button className="btn btn-sm btn-info" onClick={() => showStatHandler(link.alias)} type="button">
              <ChartNoAxesCombined />
              <span className="uppercase">statistics</span>
            </button>
            <button className="btn btn-sm btn-info" onClick={() => showInfoHandler(link.alias)} type="button">
              <Info />
              <span className="uppercase">info</span>
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => deleteLink(link.alias)} type="button">
              <Trash2 />
              <span className="uppercase">Delete</span>
            </button>
          </li>
        ))}
      </ul>

      <InfoModal />
      <StatModal />
    </>
  );
}