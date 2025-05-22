<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250522152725 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE level (id INT AUTO_INCREMENT NOT NULL, image VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, min_score INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE level_user (level_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_E4B62D585FB14BA7 (level_id), INDEX IDX_E4B62D58A76ED395 (user_id), PRIMARY KEY(level_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user ADD CONSTRAINT FK_E4B62D585FB14BA7 FOREIGN KEY (level_id) REFERENCES level (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user ADD CONSTRAINT FK_E4B62D58A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user DROP FOREIGN KEY FK_E4B62D585FB14BA7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user DROP FOREIGN KEY FK_E4B62D58A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level_user
        SQL);
    }
}
