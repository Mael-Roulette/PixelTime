<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250526064803 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE card_translation (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, locale VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, hint VARCHAR(255) NOT NULL, INDEX IDX_53BD1AF54ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE level_translation (id INT AUTO_INCREMENT NOT NULL, level_id INT NOT NULL, locale VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_459A23325FB14BA7 (level_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE card_translation ADD CONSTRAINT FK_53BD1AF54ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_translation ADD CONSTRAINT FK_459A23325FB14BA7 FOREIGN KEY (level_id) REFERENCES level (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE card DROP title, DROP description, DROP hint
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level DROP name
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP roles
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE card_translation DROP FOREIGN KEY FK_53BD1AF54ACC9A20
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_translation DROP FOREIGN KEY FK_459A23325FB14BA7
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE card_translation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level_translation
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE card ADD title VARCHAR(255) NOT NULL, ADD description VARCHAR(255) NOT NULL, ADD hint VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level ADD name VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD roles JSON NOT NULL
        SQL);
    }
}
