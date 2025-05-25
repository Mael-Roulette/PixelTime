<?php

namespace App\Entity;

use App\Repository\LevelRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: LevelRepository::class)]
class Level
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToMany(targetEntity: "User")]
    private Collection $users;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column]
    private ?int $minScore = null;

    #[ORM\OneToMany(targetEntity: "LevelTranslation", mappedBy: 'level', cascade: ['persist', 'remove'])]
    private Collection $translations;

    public function getTranslations(): Collection
    {
        return $this->translations;
    }

    public function getTranslation(string $locale): ?LevelTranslation
    {
        foreach ($this->translations as $translation) {
            if ($translation->getLocale() === $locale) {
                return $translation;
            }
        }
        return null;
    }

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->translations = new ArrayCollection();
    }

    public function addUser(User $user): static
    {
        $this->users->add($user);

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getMinScore(): ?int
    {
        return $this->minScore;
    }

    public function setMinScore(int $minScore): static
    {
        $this->minScore = $minScore;

        return $this;
    }
}
