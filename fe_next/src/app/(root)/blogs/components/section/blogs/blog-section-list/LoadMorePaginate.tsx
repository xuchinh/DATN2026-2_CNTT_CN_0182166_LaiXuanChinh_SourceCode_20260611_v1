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
        className="h-[64px] inline-flex px-[32px] py-0 justify-center items-center gap-[12px] rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#059669] font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)]"
      >
        <SVGNewspaper />
        {loadMoreTitle}
      </button>
    </div>
  );
};

export default LoadMorePaginate;
