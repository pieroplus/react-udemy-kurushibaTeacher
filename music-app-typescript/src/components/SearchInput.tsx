import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  onSubmit: (keyword: string) => void;
  keywordState: [
    keyword: string,
    setKeyword: React.Dispatch<React.SetStateAction<string>>,
  ];
};

export function SearchInput({ keywordState, onSubmit }: Props) {
  const [keyword, setKeyword] = keywordState;
  const handleSubmit = () => {
    onSubmit(keyword);
  };

  return (
    <section className="mb-10">
      <input
        className="bg-gray-700 p-2 w-1/3 rounded-l-lg focus:outline-none"
        placeholder="探したい曲を入力してください"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value);
        }}
        value={keyword}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
        onClick={handleSubmit}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </section>
  );
}
