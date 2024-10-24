import { Redirect } from "expo-router";
import { useUserStore } from "../lib/store";

export default function App() {
  const { user, setUser } = useUserStore();

  if (!user) {
    return <Redirect href={"/login"} />;
  }

  return <Redirect href={"/(tabs)"} />;
}
