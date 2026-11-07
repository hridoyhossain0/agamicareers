import CreateAccountSection from "@/componants/homePage/CreateAccontSection";
import Feature from "@/componants/homePage/Feature";
import HeroSection from "@/componants/homePage/HeroSection";
import JobSection from "@/componants/homePage/JobSection";
import SubscriptionSection from "@/componants/homePage/Suscription";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <JobSection/>
      <Feature/>
      <SubscriptionSection/>
      <CreateAccountSection/>
    </div>
  );
}
