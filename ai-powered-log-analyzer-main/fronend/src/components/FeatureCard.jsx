import { Card, CardContent } from "@/components/ui/card";

export default function FeatureCard({ title, description }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>

        <p className="text-gray-400 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
