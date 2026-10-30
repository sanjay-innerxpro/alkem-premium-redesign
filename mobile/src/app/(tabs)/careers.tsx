import { ListScreen } from "../../components/list-screen";
import { useLoadedSite } from "../../lib/site";

export default function Careers() {
  const { t } = useLoadedSite();
  return (
    <ListScreen
      collection="careers"
      section="careers"
      emptyIcon="briefcase-outline"
      emptyTitle={t.more_on_way}
      emptyText={t.no_positions}
    />
  );
}
