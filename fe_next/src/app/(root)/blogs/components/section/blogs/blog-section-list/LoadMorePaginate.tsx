import React from "react";

import SVGNewspaper from "../../../svgs/SVGNewspaper";

interface ILoadMorePaginateProps {
  onLoadMore: () => void;
  loadMoreTitle: string;
}

const LoadMorePaginate: React.FC<ILoadMorePaginateProps> = ({
  onLoadMore,
  loadMoreTitle,
}) => {
  return (
    <div className="mt-[53px] flex items-center justify-center">
      <button
        onClick={onLoadMore}
        className="h-[64px] inline-flex px-[32px] py-0 justify-center items-center gap-[12px] rounded-[10px] bg-[#132238] text-white"
      >
        <SVGNewspaper />
        {loadMoreTitle}
      </button>
    </div>
  );
};

export default LoadMorePaginate;
