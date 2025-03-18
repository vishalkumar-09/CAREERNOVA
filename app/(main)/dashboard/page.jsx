import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
const IndustryInsightsPage = async() => {
    const {isOnboarded}= await getUserOnboardingStatus();
        if(!isOnboarded){
            redirect("/onboarding");
        }
  return (
    <div>
      IndustryInsightpage
    </div>
  )
}

export default IndustryInsightsPage
