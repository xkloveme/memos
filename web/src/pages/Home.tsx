import HomeSidebar from "@/components/HomeSidebar";
import MemoEditor from "@/components/MemoEditor";
import MemoFilter from "@/components/MemoFilter";
import MemoList from "@/components/MemoList";
import MobileHeader from "@/components/MobileHeader";

const Home = () => {
  return (
    <div className="w-full flex flex-row justify-start items-start">
      <div className="flex-grow shrink w-auto px-4 sm:px-2 sm:pt-4">
        <MobileHeader />
        <div className="w-full h-auto flex flex-col justify-start items-start bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <MemoEditor className="mb-2" cacheKey="home-memo-editor" />
          <MemoFilter />
        </div>
        <MemoList />
      </div>
      <HomeSidebar />
    </div>
  );
};

export default Home;
