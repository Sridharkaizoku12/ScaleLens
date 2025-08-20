import { TeamSection } from "@/components/TeamSection";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Target,
  Calendar,
  BarChart3,
  Zap,
  ArrowUpRight,
  Plus,
  LogOut,
  User,
  Building2,
  Brain,
  TrendingDown,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStartups, type Startup } from "@/hooks/useStartups";
import { MetricsUpload } from "@/components/MetricsUpload";
import { CreateStartupDialog } from "../components/CreateStartupDialog";
import { usePredictions } from "@/hooks/usePredictions";
import { useMetrics } from "@/hooks/useMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [forceOpenStartupDialog, setForceOpenStartupDialog] = useState(false);
  const { user, signOut } = useAuth();
  const { startups: rawStartups, loading: startupsLoading, createStartup } = useStartups();
  const startups = Array.isArray(rawStartups) ? rawStartups : [];
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  // ...existing code...
  const { toast } = useToast();
  const { metrics, latestMetric } = useMetrics(selectedStartup?.id);
  const { predictions, latestPrediction, refetchPredictions } = usePredictions(selectedStartup?.id);

  // Auto-select first startup when startups load
  useEffect(() => {
    if (startups.length > 0 && !selectedStartup) {
      setSelectedStartup(startups[0]);
    }
    if (startups.length === 0) {
      setForceOpenStartupDialog(true);
    } else {
      setForceOpenStartupDialog(false);
    }
  }, [startups, selectedStartup]);

  // ...existing code...

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b border-gray-200/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Dashboard
              </h1>
              <Select 
                value={selectedStartup?.id || ""} 
                onValueChange={(value) => {
                  const startup = startups.find(s => s.id === value);
                  setSelectedStartup(startup || null);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select startup" />
                </SelectTrigger>
                <SelectContent>
                  {startups.map((startup) => (
                    <SelectItem key={startup.id} value={startup.id}>
                      {startup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building2 className="mr-2 h-4 w-4" />
                    My Startups
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {selectedStartup && (
            <>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">{selectedStartup.sector}</Badge>
                <Badge variant="outline">{selectedStartup.stage}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {new Date(selectedStartup.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2">
                <TeamSection startupId={selectedStartup.id} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Show Add Startup dialog if no startups exist */}
        {forceOpenStartupDialog && (
          <CreateStartupDialog
            forceOpen
            onClose={() => setForceOpenStartupDialog(false)}
            onCreated={async (startupData) => {
              const created = await createStartup({
                name: startupData.name,
                sector: startupData.sector,
                stage: startupData.stage,
                team_experience: Number(startupData.experience) || 0,
                description: startupData.description,
              });
              setForceOpenStartupDialog(false);
              if (created) setSelectedStartup(created);
            }}
          />
        )}
        {!selectedStartup ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Select a startup to view its dashboard</p>
          </div>
        ) : (
          <div>
            {/* Dashboard Main Grid - CLEANED */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Startup Projects */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Startup Ideas & Projects</CardTitle>
                  <CardDescription>Projects you’ve created or are working on</CardDescription>
                </CardHeader>
                <CardContent>
                  {startups.map((startup) => (
                    <div key={startup.id} className="mb-4 p-3 rounded border border-gray-200 bg-background">
                      <div className="font-semibold text-lg">{startup.name}</div>
                      <div className="text-sm text-muted-foreground">Sector: {startup.sector} | Stage: {startup.stage}</div>
                      <div className="text-xs mt-1">Team: {startup.team_experience || 'N/A'}</div>
                    </div>
                  ))}
                  {startups.length === 0 && <div className="text-muted-foreground">No projects yet.</div>}
                </CardContent>
              </Card>

              {/* Growth Stats */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Growth & Insights</CardTitle>
                  <CardDescription>Latest growth stats and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestPrediction ? (
                    <div className="space-y-2">
                      <div>Growth Rate: <span className="font-semibold">{(latestPrediction.growth_rate * 100).toFixed(2)}%</span></div>
                      <div>Profit/Loss: <span className="font-semibold">${latestPrediction.profit_loss}</span></div>
                      <div>Cashflow: <span className="font-semibold">${latestPrediction.cashflow}</span></div>
                      <div>Runway: <span className="font-semibold">{latestPrediction.runway_months} months</span></div>
                      <div>Failure Probability: <span className="font-semibold text-destructive">{(latestPrediction.failure_probability * 100).toFixed(2)}%</span></div>
                    </div>
                  ) : <div className="text-muted-foreground">No growth data yet.</div>}
                </CardContent>
              </Card>

              {/* Metrics Upload */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upload Your Metrics</CardTitle>
                  <CardDescription>Upload your CSV/XLS files to add financial metrics for predictions.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStartup ? (
                    <MetricsUpload startupId={selectedStartup.id} />
                  ) : (
                    <div className="text-muted-foreground">Select a startup to upload metrics.</div>
                  )}
                </CardContent>
              </Card>

              {/* AI Predictions (clean, single block) */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Predictions
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!selectedStartup || !latestMetric) return;
                          await refetchPredictions();
                        }}
                        disabled={!selectedStartup || !latestMetric}
                      >
                        Generate New
                      </Button>
                  </CardTitle>
                  <CardDescription>
                    AI-powered insights based on your current metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {latestPrediction ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Growth Rate</p>
                          <p className="text-lg font-semibold text-success">
                            {(latestPrediction.growth_rate * 100).toFixed(1)}%/mo
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Failure Risk</p>
                          <p className="text-lg font-semibold text-destructive">
                            {(latestPrediction.failure_probability * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Predicted Runway</p>
                          <p className="text-lg font-semibold">
                            {latestPrediction.runway_months} months
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">12M Cashflow</p>
                          <p className="text-lg font-semibold">
                            ${latestPrediction.cashflow?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Add metrics data to generate AI predictions
                    </p>
                  )}
                  {/* AI Growth Playbook section fully removed */}
                </CardContent>
              </Card>

              {/* Team Section moved to header */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}