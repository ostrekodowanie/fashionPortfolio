# Generated by Django 4.1.1 on 2022-09-19 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Orders', '0002_useraddress_company_useraddress_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpayment',
            name='account_no',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
