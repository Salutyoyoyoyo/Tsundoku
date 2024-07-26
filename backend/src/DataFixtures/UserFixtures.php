<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Random\RandomException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @throws RandomException
     */
    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('admin@admin.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'testtest'));
        $user->setToken(bin2hex(random_bytes(16)));

        $manager->persist($user);
        $manager->flush();

        $this->addReference('user_entity', $user);

        for ($i = 1; $i <= 20; $i++) {
            $user = new User();
            $user->setEmail('user' . $i . '@example.com');
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $user->setToken(bin2hex(random_bytes(16)) . $i);

            $manager->persist($user);
            $manager->flush();

            $this->addReference('user_' . $i, $user);
        }
    }
}