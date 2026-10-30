import { ListScreen } from "../../components/list-screen";
import { useLoadedSite } from "../../lib/site";

export default function News() {
  const { t } = useLoadedSite();
  return (
    <ListScreen
      collection="news"
      section="news"
      emptyIcon="newspaper-outline"
      emptyTitle={t.more_on_way}
      emptyText={t.content_soon}
    />
  );
}
