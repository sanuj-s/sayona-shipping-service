import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";

export default function DesignQAPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)] p-12 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl">Design System QA</h1>
        <p className="text-[var(--foreground-secondary)] max-w-2xl text-balance">
          This page serves as the component inventory to ensure Figma parity, spacing, typography, and states. 
          Use this route to perform visual regression testing via Playwright.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl border-b pb-2">Buttons (CVA Variants)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="enterprise">Enterprise</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <div className="bg-[var(--foreground)] p-4 rounded-lg">
            <Button variant="hero-outline">Hero Outline</Button>
          </div>
          <Button variant="link">Link Style</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium (Default)</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl border-b pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Delivered</Badge>
          <Badge variant="warning">In Transit</Badge>
          <Badge variant="error">Exception</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl border-b pb-2">Inputs & Forms</h2>
        <div className="grid max-w-sm items-center gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tracking Number
            </label>
            <Input type="text" placeholder="e.g. SY-123456789" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Disabled Input
            </label>
            <Input type="text" placeholder="Cannot type here" disabled />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl border-b pb-2">Cards & Surfaces</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-3d">
            <CardHeader>
              <CardTitle>Glass 3D Card</CardTitle>
              <CardDescription>Using the sensory reactivity system.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card responds to mouse movement variables tracking --mouse-x and --mouse-y.</p>
            </CardContent>
            <CardFooter>
              <Button variant="accent">Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Standard Premium Card</CardTitle>
              <CardDescription>Standard surfaces for dashboards.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Simple, reliable, with standard --shadow-card depth.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl border-b pb-2">Data Tables</h2>
        <div className="bg-[var(--surface)] premium-border rounded-xl p-4">
          <Table>
            <TableCaption>A list of recent shipments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SY-001</TableCell>
                <TableCell><Badge variant="warning">In Transit</Badge></TableCell>
                <TableCell>Dubai, UAE</TableCell>
                <TableCell className="text-right">4,500 kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SY-002</TableCell>
                <TableCell><Badge variant="success">Delivered</Badge></TableCell>
                <TableCell>London, UK</TableCell>
                <TableCell className="text-right">1,200 kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      
      <Toaster />
    </div>
  );
}
