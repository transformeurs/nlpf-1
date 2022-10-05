import {
    BuildingOfficeIcon,
    CalendarIcon,
    EnvelopeIcon,
    HomeIcon,
    BanknotesIcon,
    ClockIcon,
    FlagIcon
} from "@heroicons/react/20/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../../components/button";
import Layout from "../../../components/layout";

const OfferPage: NextPage = () => {
    const router = useRouter();
    const offerId = router.query.offerId;

    const offer = {
        createdAt: new Date(),
        title: "Ingénieur QA",
        description:
            "Nous recherchons un ingénieur QA pour notre équipe de développement. Lorem ipsum dolor sit amet. 33 quam atque ad nihil cumque non tempora dolorum et sunt velit. Et molestias expedita 33 voluptate quia in omnis iure ad praesentium cumque et labore distinctio cum velit temporibus. Qui dolor quae est fugit dolores in perferendis exercitationem hic illum veritatis. </p><p>Libero numquam et quod facilis ab vitae voluptates et velit harum aut repudiandae dolor 33 quia nihil. Ut repudiandae veniam non maxime excepturi non asperiores maxime. Vel minima nemo qui eligendi quam est quidem vero. Sit alias omnis hic magnam quam 33 fuga architecto et omnis quidem? </p><p>Est praesentium rerum aut alias adipisci aut vitae repellat vel cupiditate ipsam id internos quidem est molestiae nisi. Qui sequi odio  aspernatur laudantium et alias magnam. Ut corporis esse rem inventore nihil qui distinctio voluptate eos expedita cumque  molestiae assumenda in nulla velit cum eligendi magnam. Ea officia nihil  labore quis et dignissimos saepe id soluta aliquam 33 commodi laudantium et voluptas quisquam.",
        author: "Société Générale",
        contact: "rh@sg.fr",
        skills: ["Stage", "Agile", "Typescript", "React", "Next.js"],
        location: "Paris",
        salary: 2000,
        time: "6 mois",
        startTime: "Février",
        responseTime: 60,
        questions: [
            {
                question: "Quel temps fait-il dehors ?",
                answers: ["réponse possible 1", "réponse possible 2", "réponse possible 3"]
            }
        ]
    };

    const fields = [
        {
            icon: CalendarIcon,
            label: "Date de création",
            value: offer.createdAt.toLocaleDateString()
        },
        { icon: BuildingOfficeIcon, label: "Entreprise", value: offer.author },
        { icon: EnvelopeIcon, label: "Contact", value: offer.contact },
        { icon: HomeIcon, label: "Localisation", value: offer.location },
        {
            icon: BanknotesIcon,
            label: "Salaire",
            value: (offer.salary as number).toLocaleString() + " €"
        },
        { icon: FlagIcon, label: "Début", value: offer.startTime },
        { icon: ClockIcon, label: "Durée", value: offer.time }
    ];

    return (
        <Layout
            breadcrumbs={[
                { label: "Offres", href: "/offers" },
                { label: `Offre ${offer.title}`, href: `/offers/${offerId}` }
            ]}
        >
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-white p-8 shadow">
                    <div className="text-2xl font-semibold text-indigo-700">{offer.title}</div>
                    <div className="my-3">{offer.description}</div>
                </div>
                <div className="col-span-1 rounded-lg bg-white p-8 shadow">
                    <div className="text-2xl font-semibold text-indigo-700">Informations</div>

                    <div className="mt-4 space-y-2">
                        {fields.map((field) => (
                            <div className="mt-0.5 flex items-center text-gray-800">
                                <field.icon className="mr-1 h-5 w-5" />
                                <div className="font-medium">{field.label}</div>
                                <div className="flex-1 text-end text-gray-600">{field.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
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
                <div className="col-span-3 grid grid-cols-4 gap-4">
                    <div className="col-span-2 col-start-2 space-y-2 rounded-lg bg-white p-8 shadow">
                        <div className="text-2xl font-semibold text-indigo-700">Candidater</div>

                        <div className="divide-y divide-gray-400">
                            <div className="text-lg font-medium text-gray-800">Documents</div>
                            <div>
                                <div className="grid grid-cols-2">
                                    <div className="font-medium text-gray-700">C.V.</div>
                                    <div></div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="font-medium text-gray-700">
                                        Lettre de motivation
                                        <div className="mt-3">
                                            <Button
                                                type={ButtonType.SECONDARY}
                                                size={ButtonSize.MD}
                                                label={"Choisir un fichier"}
                                            />
                                            <span className="text-s ml-3 text-gray-600">
                                                {/* ref={fileName} */}
                                                Aucun fichier choisi
                                            </span>
                                        </div>
                                        {/* Hidden file input, handled by the Button component */}
                                        <input
                                            type="file"
                                            id="photo"
                                            name="photo"
                                            // ref={hiddenFileInput}
                                            style={{ display: "none" }}
                                            onChange={() => {}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-400">
                            <div className="text-lg font-medium text-gray-800">Questionnaire</div>
                            <div>dassad</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OfferPage;
