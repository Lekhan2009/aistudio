
"use client";

import { useRouter } from "next/navigation";

type Props = {
    startCursor: string
    endCursor: string
    hasPreviousPage: boolean
    hasNextPage: boolean
}

const LoadMore = ({ startCursor, endCursor, hasPreviousPage, hasNextPage }: Props) => {
    const router = useRouter();

    const handleNavigation = (type: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        
        if (type === "prev" && hasPreviousPage) {
            currentParams.delete("endcursor");
            currentParams.set("startcursor", startCursor);
        } else if (type === "next" && hasNextPage) {
            currentParams.delete("startcursor");
            currentParams.set("endcursor", endCursor);
        }
        
        const newSearchParams = currentParams.toString();
        const newPathname = `${window.location.pathname}?${newSearchParams}`;
        
        router.push(newPathname);
    };

    return (
        <div className="w-full flexCenter gap-5 mt-10">
            {hasPreviousPage && (
                <button className="flexCenter gap-2 px-4 py-3 bg-light-white-200 rounded-md text-gray-100 text-sm font-medium" onClick={() => handleNavigation("prev")}>
                    First
                </button>
            )}
            {hasNextPage && (
                <button className="flexCenter gap-2 px-4 py-3 bg-light-white-200 rounded-md text-gray-100 text-sm font-medium" onClick={() => handleNavigation("next")}>
                    Next
                </button>
            )}
        </div>
    );
};

export default LoadMore;
