"use client";

interface ListFilterProps {
  lists: string[];
  selectedList: string | null;
  onSelect: (name: string) => void;
  onCreateList: () => void;
}

export default function ListFilter({
  lists,
  selectedList,
  onSelect,
  onCreateList,
}: ListFilterProps) {
  return (
    <div className="w-full py-4 bg-[#0a0e1a] border-b border-blue-500">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 px-4">
        {lists.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`px-3 py-2 rounded-full font-semibold whitespace-nowrap transition
              ${
                selectedList === name
                  ? "px-3 py-1 text-xs text-gray-100 rounded-full border border-blue-500 bg-blue-600"
                  : "rounded-full border px-3 py-1 text-xs text-gray-100 hover:bg-blue-800 hover:text-white"
              }
            `}
          >
            {name}
          </button>
        ))}
        <button
          onClick={onCreateList}
          className="px-3 py-1 rounded-full border border-blue-800 text-gray-100 hover:bg-blue-700 hover:text-white transition"
        >
          Create List
        </button>
      </div>
    </div>
  );
}
