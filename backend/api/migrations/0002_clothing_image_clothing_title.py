# Generated by Django 4.1 on 2022-08-30 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='clothing',
            name='image',
            field=models.ImageField(default='', upload_to='images/'),
        ),
        migrations.AddField(
            model_name='clothing',
            name='title',
            field=models.CharField(default='', max_length=100),
        ),
    ]