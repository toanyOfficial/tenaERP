type SearchActionsProps = {
  onSearch: () => void;
  onReset?: () => void;
  disableSearch?: boolean;
};

export function SearchActions({ onSearch, onReset, disableSearch }: SearchActionsProps) {
  return (
    <div className="ml-auto flex items-center gap-2">
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="h-8 rounded border border-slate-300 px-3 text-xs text-slate-700"
        >
          초기화
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSearch}
        disabled={disableSearch}
        className="h-8 rounded bg-slate-900 px-3 text-xs text-white disabled:opacity-50"
      >
        조회
      </button>
    </div>
  );
}
