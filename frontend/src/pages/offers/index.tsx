import { BuildingOfficeIcon, CalendarIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import Layout from "../../components/layout";

const Home: NextPage = () => {
    const offers = [
        {
            createdAt: new Date(),
            title: "Ingénieur QA",
            description: "Nous recherchons un ingénieur QA pour notre équipe de développement.",
            author: "Société Générale",
            contact: "rh@sg.fr",
            skills: ["Stage", "Agile", "Typescript", "React"],
            responseTime: 60
        },
        {
            createdAt: new Date(),
            title: "Developper FullStack",
            description:
                "Nous recherchons un développeur FullStack pour notre équipe de développement.",
            author: "SAP",
            contact: "rh@sap-les-meilleurs.com",
            skills: ["CDD", "Agile", "Python", "JavaScript", "Vue"],
            responseTime: 95
        }
    ];

    return (
        <Layout breadcrumbs={[{ label: "Offres", href: "/offers" }]}>
            <div className="space-y-10">
                {offers.map((offer, offerIdx) => (
                    <div key={offerIdx} className="flex rounded bg-white p-6 shadow-lg">
                        {/* Box content */}
                        <div className="w-full">
                            <div className="text-xl font-semibold text-indigo-700">
                                {offer.title}
                            </div>

                            <div className="mt-0.5 flex items-center text-sm text-gray-600">
                                <CalendarIcon className="mr-1 h-5 w-5" />
                                {offer.createdAt.toDateString()}
                            </div>
                            <div className="my-3">{offer.description}</div>
                            <div className="flex items-center font-medium text-gray-600">
                                <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                                {offer.author} <EnvelopeIcon className="mr-1 ml-5 h-5 w-5" />
                                {offer.contact}
                            </div>
                            <div className="mt-4 flex space-x-2">
                                {offer.skills.map((skill, skillIdx) => (
                                    <div
                                        key={skillIdx}
                                        className="rounded-2xl border border-gray-400 px-2 py-0.5 text-gray-500"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right content */}
                        <div className="flex flex-col">
                            <div>
                                <Button
                                    type={ButtonType.PRIMARY}
                                    size={ButtonSize.XL}
                                    label={"Postuler"}
                                    rightIcon={CursorArrowRaysIcon}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <div className="mt-2 whitespace-nowrap text-sm text-gray-600">
                                    {offer.responseTime}% de taux de réponse
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;
