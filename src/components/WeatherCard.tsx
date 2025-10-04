import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WeatherCardProps = {
  location: { lat: number; lon: number; address: string };
  date: string;
  probabilities: Record<
    string,
    { value: number; uncertainty: number; confidence: string }
  >;
  recommendations?: string[];
};

export default function WeatherCard({
  location,
  date,
  probabilities,
  recommendations,
}: WeatherCardProps) {
  const keysToShow = [
    "rain",
    "snow",
    "cloud_cover",
    "wind_speed_high",
    "temperature_hot",
    "temperature_cold",
    "heat_wave",
    "cold_snap",
    "heavy_rain",
    "dust_event",
    "uncomfortable_index",
  ];

  return (
    <Card className="w-full h-full bg-background text-foreground border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {location?.address ?? "Unknown Location"}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Forecast for {date}
        </CardDescription>
        <div className="text-xs text-muted-foreground mt-1">
          📍 {location?.lat.toFixed(2)}, {location?.lon.toFixed(2)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {keysToShow.map((key) => {
            const p = probabilities[key];
            if (!p) return null;
            return (
              <div
                key={key}
                className="flex justify-between items-center text-sm border-b pb-1"
              >
                <span className="capitalize">{key.replace(/_/g, " ")}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {(p.value * 100).toFixed(0)}%
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ±{(p.uncertainty * 100).toFixed(0)}%
                  </span>
                  <Badge
                    variant={
                      p.confidence === "high"
                        ? "default"
                        : p.confidence === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {p.confidence}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-1">Recommendations</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {recommendations?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
