'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Politique de confidentialité</h1>
                <p className="mb-4">
                    Chez Tsundoku, nous respectons votre vie privée et nous nous engageons à protéger vos informations personnelles. Cette politique de confidentialité décrit les types d'informations que nous recueillons, comment nous les utilisons et les mesures que nous prenons pour assurer leur sécurité.
                </p>
                <h2 className="text-2xl font-bold mb-4">Collecte des informations</h2>
                <p className="mb-4">
                    Nous collectons des informations que vous nous fournissez directement, comme votre nom, votre adresse e-mail, et d'autres informations personnelles lorsque vous vous inscrivez à notre service ou utilisez notre site.
                </p>
                <h2 className="text-2xl font-bold mb-4">Utilisation des informations</h2>
                <p className="mb-4">
                    Nous utilisons les informations recueillies pour fournir, maintenir et améliorer nos services, ainsi que pour vous communiquer des mises à jour, des promotions et d'autres informations pertinentes.
                </p>
                <h2 className="text-2xl font-bold mb-4">Partage des informations</h2>
                <p className="mb-4">
                    Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas où cela est nécessaire pour vous fournir nos services, lorsque vous avez donné votre consentement, ou lorsque la loi nous y oblige.
                </p>
                <h2 className="text-2xl font-bold mb-4">Sécurité des informations</h2>
                <p className="mb-4">
                    Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre tout accès non autorisé, toute modification, divulgation ou destruction de vos données.
                </p>
                <h2 className="text-2xl font-bold mb-4">Modifications de cette politique</h2>
                <p className="mb-4">
                    Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page. Nous vous encourageons à consulter cette politique régulièrement pour rester informé.
                </p>
                <p className="text-center mt-6">
                    Si vous avez des questions concernant cette politique de confidentialité, n'hésitez pas à nous contacter à l'adresse e-mail suivante : <a href="mailto:support@tsundoku.com" className="text-blue-500 hover:underline">support@tsundoku.com</a>.
                </p>
            </div>
        </div>
    );
}