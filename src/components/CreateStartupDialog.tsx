import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateStartupDialog({
  forceOpen,
  onClose,
  onCreated,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
  onCreated?: (startup: any) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof forceOpen === "boolean" ? forceOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (typeof forceOpen === "boolean" && onClose) {
      if (!val) onClose();
    } else {
      setInternalOpen(val);
    }
  };

  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [founderName, setFounderName] = useState("");
  const [coFounder, setCoFounder] = useState("");
  const [stage, setStage] = useState("");
  const [phone, setPhone] = useState("");
  const [cashflow, setCashflow] = useState("");
  const [experience, setExperience] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreated)
      onCreated({
        name,
        companyEmail,
        founderName,
        coFounder,
        stage,
        phone,
        sector,
        description,
        cashflow,
        experience, // ✅ BUG FIX: Added the missing 'experience' field
      });
    setOpen(false);
    setName("");
    setCompanyEmail("");
    setFounderName("");
    setCoFounder("");
    setStage("");
    setPhone("");
    setSector("");
    setDescription("");
    setCashflow("");
    setExperience("");
  };

  return (
    <TooltipProvider>
      <div>
        <Button onClick={() => setOpen(true)} variant="default" className="mx-auto block">
          Add Your Startup
        </Button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto p-4">
            <Card className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle>Add Your Startup</CardTitle>
                <CardDescription>
                  Fill in as much detail as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Startup Name */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="startup-name">Startup Name</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Enter your official startup or project name.</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="startup-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. ScaleLens"
                      />
                    </div>

                    {/* Company Email */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="company-email">Company Email</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Use a business or founder email (not personal if possible).</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="company-email"
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        required
                        placeholder="e.g. hello@scalelens.com"
                      />
                    </div>

                    {/* Founder Name */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="founder-name">Founder Name</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Who is the main founder? (Full name)</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="founder-name"
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        required
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    {/* Co-Founder (Optional) */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="co-founder">Co-Founder (Optional)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>List a co-founder if you have one (optional).</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="co-founder"
                        value={coFounder}
                        onChange={(e) => setCoFounder(e.target.value)}
                        placeholder="e.g. John Smith"
                      />
                    </div>

                    {/* Stage */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="stage">Stage</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>What stage is your startup?</TooltipContent>
                        </Tooltip>
                      </div>
                      <Select value={stage} onValueChange={setStage} required>
                        <SelectTrigger id="stage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                          <SelectItem value="mvp">MVP</SelectItem>
                          <SelectItem value="early_stage">Early Stage</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                          <SelectItem value="mature">Mature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cashflow */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="cashflow">Cashflow</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Current monthly cashflow (USD).</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="cashflow"
                        type="number"
                        value={cashflow}
                        onChange={(e) => setCashflow(e.target.value)}
                        required
                        placeholder="e.g. 10000"
                      />
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Founder or company contact number.</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 555 0101"
                      />
                    </div>

                    {/* Sector */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="sector">Sector</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>What sector is your startup in?</TooltipContent>
                        </Tooltip>
                      </div>
                      <Select value={sector} onValueChange={setSector} required>
                        <SelectTrigger id="sector">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="healthtech">Healthtech</SelectItem>
                          <SelectItem value="edtech">Edtech</SelectItem>
                          <SelectItem value="ecommerce">E-Commerce</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="ai_ml">AI/ML</SelectItem>
                          <SelectItem value="biotech">Biotech</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Experience (years) */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="experience">Team Experience (years)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            How many years of relevant experience does your team have (average)?
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                        placeholder="e.g. 5"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Briefly describe your startup, product, or vision (1–2 sentences).
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {/* ✅ IMPROVEMENT: Replaced Input with Textarea */}
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. AI-powered platform to predict startup success"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
