// app/users/[userId]/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/user-store";

interface UserPageProps {
  params: {
    userId: string;
  };
}

const UserPage: React.FC<UserPageProps> = ({ params }) => {
  const { userId } = params;
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       try {
  //         await fetchUserById(userId);
  //         setLoading(false);
  //       } catch (err) {
  //         setError("Failed to fetch user");
  //         setLoading(false);
  //       }
  //     };

  //     fetchUser();
  //   }, [userId, fetchUserById]);

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">User Email: {user.email}</h1>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default UserPage;
