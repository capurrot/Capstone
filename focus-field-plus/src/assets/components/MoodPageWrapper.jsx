import { useParams } from "react-router";
import MoodPage from "./MoodPage";

function MoodPageWrapper() {
  const { moodName } = useParams();
  return <MoodPage moodName={moodName} />;
}

export default MoodPageWrapper;
