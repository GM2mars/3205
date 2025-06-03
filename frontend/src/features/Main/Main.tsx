import { Input } from "./components";
import { List } from "./components/List";

export const Main = () => {

  return (
    <div className="container mx-auto">
      <div className="w-full h-dvh flex flex-col items-center">
        <div className="w-[900px] mt-[30vh]">
          <Input />
        </div>
        <div className="max-w-[900px] w-full mt-24">
          <List />
        </div>
      </div>
    </div>
  )
};