type Props = {
  onNext: (() => Promise<void>) | null;
  onPrev: (() => Promise<void>) | null;
};

export function Pagination({ onNext, onPrev }: Props) {
  return (
    <div className="mt-8 flex justify-center">
      {onPrev && (
        <button
          onClick={onPrev}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Previous
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Next
        </button>
      )}
    </div>
  );
}
