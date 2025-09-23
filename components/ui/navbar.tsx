import { ReactNode } from "react";

export default function Navbar({left,right} : {left?:ReactNode, right?:ReactNode}) {

    return (
        <div className="absolute w-screen max-w-full h-16 top-0 shadow-lg flex justify-between items-center px-4">
            <div>
                {left}
            </div>
            <div>
                {right}
            </div>
        </div>
    );
}
