import EarningGrowthChart from "../../ui/Modal/charts/EarningGrowthChart";
import SellerGrowthChart from "../../ui/Modal/charts/SellerGrowthChart";
import UserGrowthChart from "../../ui/Modal/charts/UserGrowthChart";

export default function GrowthChartsDashboard() {
  return (
    <div className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <UserGrowthChart />
        <SellerGrowthChart />
        <EarningGrowthChart />
      </div>
    </div>
  );
}
