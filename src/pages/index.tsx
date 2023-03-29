import { type NextPage } from "next";
import Head from "next/head";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/Loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="mr-auto flex gap-3">
      <Image
        src={user?.profileImageUrl}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-full"
      />
      <input
        type="text"
        placeholder="Type something..."
        className="w-full grow bg-transparent"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-300 p-8">
      <Image
        src={author.profileImageUrl}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-full"
      />
      <div>
        <h2 className="font-bold">
          {author.name}
          <span className="font-light text-slate-400">{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </h2>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong.</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching data asap
  api.posts.getAll.useQuery();
  // return empty div if user is not loaded
  if (!userLoaded) return <div />;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen justify-center">
        <div className="w-full border-x border-slate-300  md:max-w-2xl">
          <div className="flex items-center border-b border-slate-300 p-8">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && (
              <>
                <CreatePostWizard />
                <SignOutButton />
              </>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
