import ComponentUploader from "@/src/components/Analyzer/ComponentUploader";
import ProfilerPanel from "@/src/components/Analyzer/ProfilerPanel";

export default function AnalyzerPage() {
  return (
    <div className="p-4">
      <ProfilerPanel>
        <ComponentUploader />
      </ProfilerPanel>
    </div>
  );
}
