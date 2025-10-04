import { Card, CardHeader, CardContent } from "@/components/ui/card";

type WeatherCardProps = {
  city: string;
  temp: number;
  condition: string;
};

export default function WeatherCard({
  city,
  temp,
  condition,
}: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto mt-6 bg-background text-foreground">
      <CardHeader>
        <h2 className="text-xl font-semibold">{city}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{temp}°C</p>
        <p className="text-sm text-muted-foreground">{condition}</p>
      </CardContent>
    </Card>
  );
}
