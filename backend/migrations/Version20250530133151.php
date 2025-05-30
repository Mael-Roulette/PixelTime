<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250530133151 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE card (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, year INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE card_translation (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, locale VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, hint VARCHAR(255) NOT NULL, INDEX IDX_53BD1AF54ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE level (id INT AUTO_INCREMENT NOT NULL, image VARCHAR(255) NOT NULL, min_score INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE level_user (level_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_E4B62D585FB14BA7 (level_id), INDEX IDX_E4B62D58A76ED395 (user_id), PRIMARY KEY(level_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE level_translation (id INT AUTO_INCREMENT NOT NULL, level_id INT NOT NULL, locale VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_459A23325FB14BA7 (level_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, profile_picture VARCHAR(255) DEFAULT NULL, pseudo VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, score INT DEFAULT NULL, money INT DEFAULT NULL, roles JSON NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', last_login_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE card_translation ADD CONSTRAINT FK_53BD1AF54ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user ADD CONSTRAINT FK_E4B62D585FB14BA7 FOREIGN KEY (level_id) REFERENCES level (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user ADD CONSTRAINT FK_E4B62D58A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_translation ADD CONSTRAINT FK_459A23325FB14BA7 FOREIGN KEY (level_id) REFERENCES level (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE card_translation DROP FOREIGN KEY FK_53BD1AF54ACC9A20
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user DROP FOREIGN KEY FK_E4B62D585FB14BA7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_user DROP FOREIGN KEY FK_E4B62D58A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE level_translation DROP FOREIGN KEY FK_459A23325FB14BA7
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE card
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE card_translation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level_user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE level_translation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE messenger_messages
        SQL);
    }
}
