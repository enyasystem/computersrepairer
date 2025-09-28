import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Shield, Wrench, Network, HardDrive, Smartphone, Monitor } from "lucide-react"

const services = [
	{
		icon: <Wrench className="h-8 w-8" />,
		title: "Computer Repair",
		description: "Complete hardware and software repair services for desktops and laptops",
		features: [
			"Hardware diagnostics",
			"Component replacement",
			"Software troubleshooting",
			"Virus removal",
		],
		price: "From ₦49",
		turnaround: "Same day",
	},
	{
		icon: <Network className="h-8 w-8" />,
		title: "IT Support",
		description: "Comprehensive IT support for businesses and individuals",
		features: [
			"Remote support",
			"On-site visits",
			"System maintenance",
			"24/7 monitoring",
		],
		price: "From ₦99/month",
		turnaround: "Immediate",
	},
	{
		icon: <HardDrive className="h-8 w-8" />,
		title: "Data Recovery",
		description: "Professional data recovery from failed drives and corrupted systems",
		features: [
			"Hard drive recovery",
			"SSD recovery",
			"RAID recovery",
			"File restoration",
		],
		price: "From ₦149",
		turnaround: "2-5 days",
	},
	{
		icon: <Shield className="h-8 w-8" />,
		title: "Network Security",
		description: "Secure your network infrastructure and protect against threats",
		features: [
			"Firewall setup",
			"Security audits",
			"Malware removal",
			"VPN configuration",
		],
		price: "From ₦199",
		turnaround: "1-2 days",
	},
	{
		icon: <Smartphone className="h-8 w-8" />,
		title: "Mobile Device Repair",
		description: "Professional repair services for smartphones and tablets",
		features: [
			"Screen replacement",
			"Battery replacement",
			"Water damage repair",
			"Software issues",
		],
		price: "From ₦79",
		turnaround: "1-2 hours",
	},
	{
		icon: <Monitor className="h-8 w-8" />,
		title: "System Upgrades",
		description: "Upgrade your system for better performance and reliability",
		features: [
			"RAM upgrades",
			"SSD installation",
			"Graphics card upgrade",
			"Performance optimization",
		],
		price: "From ₦89",
		turnaround: "Same day",
	},
]

const certifications = [
	"CompTIA A+ Certified",
	"Microsoft Certified Professional",
	"Cisco Certified Network Associate",
	"Apple Certified Mac Technician",
]

export default function ServicesPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
							Professional IT Services
						</h1>
						<p className="text-xl text-muted-foreground mb-8 text-pretty">
							Expert computer repair, IT support, and technology solutions for
							businesses and individuals. Fast, reliable, and affordable services
							with certified technicians.
						</p>
						<div className="flex flex-wrap justify-center gap-4 mb-8">
							{certifications.map((cert, index) => (
								<Badge key={index} variant="secondary" className="px-4 py-2">
									<CheckCircle className="h-4 w-4 mr-2" />
									{cert}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Services Grid */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Our Services
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Comprehensive technology solutions tailored to your needs
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<Card
								key={index}
								className="h-full hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-center gap-4 mb-4">
										<div className="p-3 bg-primary/10 rounded-lg text-primary">
											{service.icon}
										</div>
										<div>
											<CardTitle className="text-xl">
												{service.title}
											</CardTitle>
											<div className="flex items-center gap-4 mt-2">
												<Badge variant="outline">{service.price}</Badge>
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="h-4 w-4 mr-1" />
													{service.turnaround}
												</div>
											</div>
										</div>
									</div>
									<CardDescription className="text-base">
										{service.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 mb-6">
										{service.features.map((feature, featureIndex) => (
											<li
												key={featureIndex}
												className="flex items-center text-sm"
											>
												<CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
									<Button className="w-full">Get Quote</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Why Choose ComputersRepairer?
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								<Clock className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Fast Turnaround</h3>
							<p className="text-muted-foreground">
								Most repairs completed same day or within 24 hours
							</p>
						</div>
						<div className="text-center">
							<div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								<Shield className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Certified Experts</h3>
							<p className="text-muted-foreground">
								Industry-certified technicians with years of experience
							</p>
						</div>
						<div className="text-center">
							<div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								<CheckCircle className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
							<p className="text-muted-foreground">
								90-day warranty on all repairs and services
							</p>
						</div>
						<div className="text-center">
							<div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								<Wrench className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
							<p className="text-muted-foreground">
								Transparent, competitive pricing with no hidden fees
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Contact us today for a free consultation and quote on your technology
						needs
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" className="px-8">
							Schedule Service
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="px-8 bg-transparent"
						>
							Get Free Quote
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}
