import { getSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/forms";
export default async function Settings() {
  const settings = await getSettings();
  return (
    <>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">Settings</span>
          <h1>Website settings</h1>
          <p>Your identity, homepage and first impression.</p>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
