package store

import (
	"context"
	"database/sql"

	storepb "github.com/usememos/memos/proto/gen/store"
)

// Driver is an interface for store driver.
// It contains all methods that store database driver should implement.
type Driver interface {
	GetDB() *sql.DB
	Close() error

	Migrate(ctx context.Context) error
	Vacuum(ctx context.Context) error
	BackupTo(ctx context.Context, filename string) error

	// Activity model related methods.
	CreateActivity(ctx context.Context, create *Activity) (*Activity, error)
	ListActivity(ctx context.Context, find *FindActivity) ([]*Activity, error)

	// Resource model related methods.
	CreateResource(ctx context.Context, create *Resource) (*Resource, error)
	ListResources(ctx context.Context, find *FindResource) ([]*Resource, error)
	UpdateResource(ctx context.Context, update *UpdateResource) (*Resource, error)
	DeleteResource(ctx context.Context, delete *DeleteResource) error

	// Memo model related methods.
	CreateMemo(ctx context.Context, create *Memo) (*Memo, error)
	ListMemos(ctx context.Context, find *FindMemo) ([]*Memo, error)
	UpdateMemo(ctx context.Context, update *UpdateMemo) error
	DeleteMemo(ctx context.Context, delete *DeleteMemo) error
	FindMemosVisibilityList(ctx context.Context, memoIDs []int32) ([]Visibility, error)

	// MemoRelation model related methods.
	UpsertMemoRelation(ctx context.Context, create *MemoRelation) (*MemoRelation, error)
	ListMemoRelations(ctx context.Context, find *FindMemoRelation) ([]*MemoRelation, error)
	DeleteMemoRelation(ctx context.Context, delete *DeleteMemoRelation) error

	// MemoOrganizer model related methods.
	UpsertMemoOrganizer(ctx context.Context, upsert *MemoOrganizer) (*MemoOrganizer, error)
	ListMemoOrganizer(ctx context.Context, find *FindMemoOrganizer) ([]*MemoOrganizer, error)
	DeleteMemoOrganizer(ctx context.Context, delete *DeleteMemoOrganizer) error

	// SystemSetting model related methods.
	UpsertSystemSetting(ctx context.Context, upsert *SystemSetting) (*SystemSetting, error)
	ListSystemSettings(ctx context.Context, find *FindSystemSetting) ([]*SystemSetting, error)

	// User model related methods.
	CreateUser(ctx context.Context, create *User) (*User, error)
	UpdateUser(ctx context.Context, update *UpdateUser) (*User, error)
	ListUsers(ctx context.Context, find *FindUser) ([]*User, error)
	DeleteUser(ctx context.Context, delete *DeleteUser) error

	// UserSetting model related methods.
	UpsertUserSetting(ctx context.Context, upsert *UserSetting) (*UserSetting, error)
	ListUserSettings(ctx context.Context, find *FindUserSetting) ([]*UserSetting, error)
	UpsertUserSettingV1(ctx context.Context, upsert *storepb.UserSetting) (*storepb.UserSetting, error)
	ListUserSettingsV1(ctx context.Context, find *FindUserSettingV1) ([]*storepb.UserSetting, error)

	// IdentityProvider model related methods.
	CreateIdentityProvider(ctx context.Context, create *IdentityProvider) (*IdentityProvider, error)
	ListIdentityProviders(ctx context.Context, find *FindIdentityProvider) ([]*IdentityProvider, error)
	GetIdentityProvider(ctx context.Context, find *FindIdentityProvider) (*IdentityProvider, error)
	UpdateIdentityProvider(ctx context.Context, update *UpdateIdentityProvider) (*IdentityProvider, error)
	DeleteIdentityProvider(ctx context.Context, delete *DeleteIdentityProvider) error

	// Tag model related methods.
	UpsertTag(ctx context.Context, upsert *Tag) (*Tag, error)
	ListTags(ctx context.Context, find *FindTag) ([]*Tag, error)
	DeleteTag(ctx context.Context, delete *DeleteTag) error

	// Storage model related methods.
	CreateStorage(ctx context.Context, create *Storage) (*Storage, error)
	ListStorages(ctx context.Context, find *FindStorage) ([]*Storage, error)
	GetStorage(ctx context.Context, find *FindStorage) (*Storage, error)
	UpdateStorage(ctx context.Context, update *UpdateStorage) (*Storage, error)
	DeleteStorage(ctx context.Context, delete *DeleteStorage) error
}
