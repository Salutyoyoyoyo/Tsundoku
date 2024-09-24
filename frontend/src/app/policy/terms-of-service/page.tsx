'use client';

import React from 'react';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Conditions générales</h1>
                <p className="mb-4">
                    Bienvenue chez Tsundoku. En utilisant notre site et nos services, vous acceptez de respecter les conditions générales suivantes.
                </p>
                <h2 className="text-2xl font-bold mb-4">Utilisation des services</h2>
                <p className="mb-4">
                    Vous vous engagez à utiliser notre site et nos services de manière légale et éthique. Toute utilisation abusive, frauduleuse ou illégale de nos services entraînera la résiliation de votre compte.
                </p>
                <h2 className="text-2xl font-bold mb-4">Contenu utilisateur</h2>
                <p className="mb-4">
                    Vous êtes responsable du contenu que vous publiez ou partagez sur notre site. Vous garantissez que ce contenu ne viole aucun droit d&#39;auteur, droit de propriété intellectuelle ou autre droit de tiers.
                </p>
                <h2 className="text-2xl font-bold mb-4">Limitation de responsabilité</h2>
                <p className="mb-4">
                    Tsundoku ne sera en aucun cas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l&#39;utilisation ou de l&#39;incapacité à utiliser nos services.
                </p>
                <h2 className="text-2xl font-bold mb-4">Modifications des conditions</h2>
                <p className="mb-4">
                    Nous nous réservons le droit de modifier ces conditions générales à tout moment. Nous vous informerons de tout changement en publiant les nouvelles conditions sur cette page. Nous vous recommandons de consulter ces conditions régulièrement.
                </p>
                <p className="text-center mt-6">
                    Si vous avez des questions concernant ces conditions générales, veuillez nous contacter à l&#39;adresse suivante : <a href="mailto:support@tsundoku.com" className="text-blue-500 hover:underline">support@tsundoku.com</a>.
                </p>
            </div>
        </div>
    );
}