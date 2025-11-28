<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create documents table
 * Stores all uploaded application documents (passport, transcripts, etc.)
 */
class CreateDocumentsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('documents');

        $table->addColumn('application_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('document_type', 'enum', [
                  'values' => [
                      'passport',
                      'transcript',
                      'degree_certificate',
                      'recommendation_letter',
                      'personal_statement',
                      'cv_resume',
                      'english_test_certificate',
                      'financial_document',
                      'other'
                  ],
                  'null' => false
              ])
              ->addColumn('document_name', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('original_filename', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('file_path', 'string', ['limit' => 500, 'null' => false])
              ->addColumn('file_size', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('mime_type', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('file_extension', 'string', ['limit' => 10, 'null' => false])
              ->addColumn('is_verified', 'boolean', ['default' => false])
              ->addColumn('verified_by', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('verified_at', 'timestamp', ['null' => true])
              ->addColumn('verification_notes', 'text', ['null' => true])
              ->addColumn('status', 'enum', [
                  'values' => ['pending', 'under_review', 'approved', 'rejected', 'needs_revision'],
                  'default' => 'pending'
              ])
              ->addColumn('rejection_reason', 'text', ['null' => true])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('uploaded_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['application_id'])
              ->addIndex(['user_id'])
              ->addIndex(['document_type'])
              ->addIndex(['status'])
              ->addIndex(['is_verified'])
              ->addIndex(['uploaded_at'])
              ->addForeignKey('application_id', 'applications', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('verified_by', 'users', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}
